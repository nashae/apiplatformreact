<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  attributes= {
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=20,
 *      "order": {"sentAt":"desc"}
 *  },
 *  normalizationContext={
 *      "groups"={"invoices_read"}
 *  },
 *  denormalizationContext={"disable_type_enforcement"=true},
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"={"groups"={"invoices_subresource"}}    
 *      }
 *  },
 *  itemOperations={"GET", "PUT", "DELETE", "increment"={
 *          "method"="post", 
 *          "path"="/invoices/{id}/increment",
 *          "controller"="App\Controller\InvoiceIncrementationController",
 *          "openapi_context"={
 *              "summary"="Incremente une facture",
 *              "description"="incremente le chrono d'une facture"
 *          }
 *        }
 *   }
 *  )
 * @ApiFilter(OrderFilter::class, properties={"sentAt", "amount"})
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="le montant doit etre sous forme numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\Type("\DateTimeInterface", message="la date doit etre au format yyyy-mm-dd")
     * @Assert\NotBlank(message="la date d'envoi doit etre renseignée")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="le status est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="le status doit etre SENT, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="le client de la facture doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="le chrono est obligatoire")
     * @assert\Type(type="integer", message="le chrono doit etre un nombre")
     */
    private $chrono;

    /**
     * recupere le total des invoices
     * @Groups({"invoices_read", "invoices_subresource"})
     *
     * @return User
     */
    public function getUser() : User
    {
        return $this->customer->getUser();
    } 

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
